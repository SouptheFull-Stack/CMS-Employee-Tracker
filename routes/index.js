const router = require("express").Router();

// Creating our separate route files into imported methods
const employeeRouter = require("./employees");
const departmentRouter = require("./departments");
const roleRouter = require("./roles");

router.use("/employees", employeeRouter);
router.use("/departments", departmentRouter);
router.use("/roles", roleRouter);

module.exports = router;
