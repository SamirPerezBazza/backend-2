import addressModel from '../address/address.model';
import User from './user.model';
const jwt = require('jsonwebtoken');

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      $and: [{ email }, { password }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.AUTH_TOKEN);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
}

export async function getUser(req, res) {
  // const { name } = req.query;
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: `User ${req.params.id} not found` });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUserCount(req, res) {
  try {
    const count = await User.count({});
    res.status(200).json({ users: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const { email } = req.body;

    const userExist = await User.findOne({ $or: [{ email: email }] });

    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const result = await User.create({ ...req.body });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function patchUser(req, res) {
  try {
    const { address = [], ...rest } = req.body;

    await addressModel.deleteMany({ userId: req.params.id });

    const toSet = await addressModel.create(address.map((a) => ({ ...a, userId: req.params.id })));

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        address: toSet.map((a) => a._id),
      },
      { new: true }
    );

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { enable: false });
    res.status(200).json({ message: 'User disabled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
