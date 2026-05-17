// services/event.service.js
const Event = require("../models/Events");

// ─── Create Event ─────────────────────────────────────────────────────────────
const createEvent = async ({
  name,
  date,
  category,
  description,
  formlink,
  createdBy,
  createdByName,
}) => {
  const event = await Event.create({
    name: name.trim(),
    date: new Date(date),
    category,
    description: description.trim(),
    formlink: formlink.trim(),
    createdBy,
    createdByName,
  });
  return event;
};

// ─── Get All Events (with filters + pagination) ───────────────────────────────
const getAllEvents = async ({
  category,
  search,
  page = 1,
  limit = 9,
  sort = "date",
}) => {
  const filter = {};

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const allowedSorts = { date: "date", createdAt: "createdAt", name: "name" };
  const sortField = allowedSorts[sort] ?? "date";

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .sort({ [sortField]: 1 })
    .skip(skip)
    .limit(Number(limit))
    .select("-__v")
    .lean();

  return {
    events,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

// ─── Get Single Event ─────────────────────────────────────────────────────────
const getEventById = async (id) => {
  const event = await Event.findById(id).select("-__v").lean();
  return event; // null if not found — controller handles 404
};

// ─── Delete Event ─────────────────────────────────────────────────────────────
const deleteEvent = async (id, userId) => {
  const event = await Event.findById(id);

  if (!event) return { notFound: true };

  if (event.createdBy.toString() !== userId.toString()) {
    return { forbidden: true };
  }

  await event.deleteOne();
  return { deleted: true };
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
