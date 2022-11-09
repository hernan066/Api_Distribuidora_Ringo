const { Router } = require('express');
const { getSalaries, getSalary, putSalary, deleteSalary, postSalary } = require('../controllers/salary');
const { getSalaryValidator, postSalaryValidator, putSalaryValidator, deleteSalaryValidator } = require('../validations/salary-validator');


const router = Router();

/**
 * {{url}}/api/salaries
 */


router.get('/', getSalaries );


router.get('/:id', getSalaryValidator , getSalary );


router.post('/', postSalaryValidator , postSalary );


router.put('/:id',putSalaryValidator, putSalary );


router.delete('/:id', deleteSalaryValidator ,deleteSalary);



module.exports = router;