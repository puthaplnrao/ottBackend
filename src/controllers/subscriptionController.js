import Subscription from "../models/Subscription.js";

export async function listSubscriptions(req, res) {
  try {
    const subs = await Subscription.find({ user: req.user._id });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createSubscription = async (req, res) => {
  try {
    const { plan, startDate, endDate } = req.body;

    const subscription = new Subscription({
      user: req.user.id,
      plan,
      startDate,
      endDate,
    });

    await subscription.save();

    res.status(201).json({ message: "Subscription created", subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
