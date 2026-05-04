const express = require("express");
const serviceController = require("../controllers/serviceController");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.get("/", serviceController.getAllServices);
router.get("/vendor/:vendorId", serviceController.getServicesByVendor);
router.get("/:id", serviceController.getServiceById);
router.post("/", authMiddleware, serviceController.createService);
router.put("/:id", authMiddleware, serviceController.updateService);
router.delete("/:id", authMiddleware, serviceController.deleteService);

module.exports = router;