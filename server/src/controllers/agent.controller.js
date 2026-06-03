import Agent from "../models/agent.model.js";

export const createAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    if (!name || !email || !mobileNumber || !password) {  
      return res.status(400).json({
        success: false,
        message: "Name, email, mobileNumber and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobileNumber = String(mobileNumber).trim();

    const existingAgent = await Agent.findOne({
      $or: [
        { email: normalizedEmail },
        { mobileNumber: normalizedMobileNumber },
      ],
    });

    if (existingAgent) {
      const message =
        existingAgent.email === normalizedEmail
          ? "Email already in use"
          : "Mobile number already in use";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const agent = await Agent.create({
      name: name.trim(),
      email: normalizedEmail,
      mobileNumber: normalizedMobileNumber,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Agents retrieved successfully",
      agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
