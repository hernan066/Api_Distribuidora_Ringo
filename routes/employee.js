const { Router } = require('express');
const { getEmployees, getEmployee, putEmployee, deleteEmployee, postEmployee } = require('../controllers/employee');
const { getEmployeeValidator, postEmployeeValidator, putEmployeeValidator, deleteEmployeeValidator } = require('../validations/employee-validator');


const router = Router();

/**
 * {{url}}/api/employees
 */


router.get('/', getEmployees );


router.get('/:id', getEmployeeValidator , getEmployee );


router.post('/', postEmployeeValidator , postEmployee );


router.put('/:id',putEmployeeValidator, putEmployee );


router.delete('/:id', deleteEmployeeValidator ,deleteEmployee);



module.exports = router;