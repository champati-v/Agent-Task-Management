import Agent from "../models/agent.model.js";
import Task from "../models/task.model.js";
import { parseUploadedFile } from "../utils/fileParser.js";

export const uploadTasks = async (req, res) => {
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

    if (!records.length) {
      return res.status(400).json({
        success: false,
        message: "No valid records found in file",
      });
    }

    console.log(`Upload parsed rows: ${records.length}`);

    const agents = await Agent.find().sort({ createdAt: 1 });
    console.log(`Upload agents found: ${agents.length}`);

    if (!agents.length) {
      return res.status(400).json({
        success: false,
        message: "No agents available for task distribution",
      });
    }

    const tasksToInsert = records.map((record, index) => ({
      ...record,
      assignedAgent: agents[index % agents.length]._id,
      uploadedAt: new Date(),
    }));

    await Task.deleteMany({});
    const createdTasks = await Task.insertMany(tasksToInsert);

    console.log(`Upload tasks created: ${createdTasks.length}`);

    return res.status(201).json({
      success: true,
      totalRecords: createdTasks.length,
      distributedAgents: agents.length,
    });
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
