// controllers/event.controller.js
const eventService = require("../services/eventservice");

// ─── POST /api/events ─────────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const { name, date, category, description, formlink } = req.body;

    // Validate — mirrors frontend validation
    const errors = {};
    if (!name?.trim()) errors.name = "Event name is required";
    if (!date) errors.date = "Event date is required";
    if (!category) errors.category = "Category is required";
    if (!description?.trim()) errors.description = "Description is required";
    if (!formlink?.trim())
      errors.formlink = "Registration form link is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const event = await eventService.createEvent({
      name,
      date,
      category,
      description,
      formlink,
      createdBy: req.user.id, // set by your auth middleware
      createdByName: req.user.name, // set by your auth middleware
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error("[createEvent]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/events ──────────────────────────────────────────────────────────
const getAllEvents = async (req, res) => {
  try {
    const { category, search, page, limit, sort } = req.query;

    const result = await eventService.getAllEvents({
      category,
      search,
      page,
      limit,
      sort,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("[getAllEvents]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.error("[getEventById]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user.id);

    if (result.notFound) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    if (result.forbidden) {
      return res.status(403).json({
        success: false,
        message: "Not authorised to delete this event",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("[deleteEvent]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleDisableEvent = async (req, res) => {
  try {
    const event = await eventService.toggleDisableEvent(req.params.id);
    res.json({ isDisabled: event.isDisabled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  toggleDisableEvent,
};
