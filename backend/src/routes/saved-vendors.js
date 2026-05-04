const express = require("express");
const savedVendorController = require("../controllers/savedVendorController");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.get("/", authMiddleware, savedVendorController.getMySavedVendors);
router.post("/", authMiddleware, savedVendorController.saveVendor);
router.delete("/:vendorId", authMiddleware, savedVendorController.removeSavedVendor);
router.put("/:vendorId/notes", authMiddleware, savedVendorController.updateNotes);

module.exports = router;