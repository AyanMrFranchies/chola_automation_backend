import { uuid } from "../../utils/uuid/generateuuid.js";

export const createRegistration = async (req, res) => {
  try {
    const {
      name,
      businessName,
      email,
      password,
      conformPassword,
      mobileNumber,
    } = req.body;

    // 1️⃣ Basic validation
    if (!name || !businessName || !email || !password || !conformPassword || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Password match
    if (password !== conformPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 3️⃣ Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // 4️⃣ Check existing email or mobile
    const existingUser = await Registration.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number already registered",
      });
    }

    // 5️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6️⃣ Create user
    const newUser = await Registration.create({
      name,
      businessName,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    // 7️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        uuid: uuid(),
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        isPaid: newUser.isPaid,
        whatsappStatus: newUser.whatsappStatus,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
