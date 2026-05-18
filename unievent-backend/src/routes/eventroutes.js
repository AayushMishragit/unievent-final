const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", eventController.getAllEvents);
router.patch(
  "/:id/toggle-disable",
  protect,
  eventController.toggleDisableEvent,
);

router.get("/:id", eventController.getEventById);

// Protected routes
router.post("/", protect, eventController.createEvent);

router.delete("/:id", protect, eventController.deleteEvent);
// PATCH /api/events/:id/toggle-disable

module.exports = router;
