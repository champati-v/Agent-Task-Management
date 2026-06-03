import Agent from "../models/agent.model.js";
import Task from "../models/task.model.js";
import { parseUploadedFile } from "../utils/fileParser.js";

const normalizeRecord = (record = {}) => ({
  firstName: String(record.firstName ?? "").trim(),
  phone: String(record.phone ?? "").trim(),
  notes: String(record.notes ?? "").trim(),
});

const validateRecordsPayload = (records) => {
  if (!Array.isArray(records) || !records.length) {
    throw new Error("Records array is required");
  }

  const normalizedRecords = records.map(normalizeRecord);
  const invalidRowIndex = normalizedRecords.findIndex((record) => !record.firstName || !record.phone);

  if (invalidRowIndex !== -1) {
    throw new Error(`Row ${invalidRowIndex + 1} is missing firstName or phone`);
  }

  return normalizedRecords;
};

const distributeRecordsToAgents = async (records) => {
  const agents = await Agent.find().sort({ createdAt: 1 });

  if (!agents.length) {
    throw new Error("No agents available for task distribution");
  }

  const tasksToInsert = records.map((record, index) => ({
    ...record,
    assignedAgent: agents[index % agents.length]._id,
    uploadedAt: new Date(),
  }));

  await Task.deleteMany({});
  const createdTasks = await Task.insertMany(tasksToInsert);

  return {
    createdTasks,
    distributedAgents: agents.length,
  };
};

export const previewUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    let records;

    try {
      records = await parseUploadedFile(req.file);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Unable to parse file",
      });
    }

    return res.status(200).json({
      success: true,
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const distributeTasks = async (req, res) => {
  try {
    let records;

    try {
      records = validateRecordsPayload(req.body?.records);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const { createdTasks, distributedAgents } = await distributeRecordsToAgents(records);

      return res.status(201).json({
        success: true,
        totalRecords: createdTasks.length,
        distributedAgents,
      });
    } catch (error) {
      const statusCode = error.message === "No agents available for task distribution" ? 400 : 500;

      return res.status(statusCode).json({
        success: false,
        message: statusCode === 400 ? error.message : "Internal server error",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedAgent", "_id name email mobileNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
