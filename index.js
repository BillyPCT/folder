const express = require('express') 
const Joi = require('joi') 
 
const app = express() 
app.use(express.json()) 
app.use(express.urlencoded({extended: false})) 
 
var employees = [{
    nip: '101010',
    name : 'Billy',
    address:'sudirman',
    hp:'084953498584',
},
{
    nip: '111111',
    name : '101a',
    address:'sudirman',
    hp:'081111111',
},
]
 
app.get('/api/employees', (req, res) => { 
    const result = { 
        status: true, 
        data: employees 
    } 
 
    res.send(result) 
}) 
 
app.get('/api/employees/:nip', (req, res) => { 
    const employeeNip = req.params.nip 
    const employee = employees.find(e => e.nip === employeeNip) 
 
    // jika tidak ditemukan  
    if (!employee) { 
        return res 
            .status(404) 
            .send({ 
                status: false, 
                message: 'Employee not found ...' 
            }) 
    } 
 
    // jika ditemukan 
    const result = { 
        status: true, 
        data: employee 
    } 
 
    res.send(result) 
}) 
 
app.post('/api/employees', (req, res) => { 
    //validation 
    const schema = Joi.object({ 
        nip: Joi.string().required(), 
        name: Joi.string().required(), 
        address: Joi.string().required(),     
        hp: Joi.number().required(), 
        
    }) 
 
    const {error} = schema.validate({ 
        nip: req.body.nip, 
        name: req.body.name, 
        address: req.body.address, 
        hp: req.body.hp, 
      
    }) 
 if(error){
    return res
        .status(400)
        .send({status:false,message:error.details[0].message})
 }
   // res.send(result) 
 
    //save data 
    const tempEmployee = { 
        nip: req.body.nip, 
        name: req.body.name, 
        address: req.body.address, 
        hp: req.body.hp, 
    
    } 
    employees.push(tempEmployee) 
 
    res.send({status:true, data: employees}) 
 
}) 
app.delete('/api/employees/:nip', (req, res) => {
    // Cari karyawan dengan NIP tertentu
    const employeeIndex = employees.findIndex(e => e.nip === req.params.nip);

    // Jika karyawan ditemukan, hapus dari array
    if (employeeIndex !== -1) {
        employees.splice(employeeIndex, 1);
        res.send({ status: true, data: employees });
    } else {
        res.status(404).send({ status: false, message: 'Employee not found' });
    }
});
 
app.put('/api/employees/:nip', (req, res)=> { 
    //searching by id 
    const employeeNip = req.params.nip 
    const employee = employees.find(e => e.nip == employeeNip) 
    //result found or not found 
    if (!employee) { 
        return res.status(404) 
                  .send ({status: false, message: 'Employee ID not found.'}) 
    } 
    const schema = Joi.object({ 
        name: Joi.string().required(), 
        address: Joi.string().required(),     
        hp: Joi.number().required(), 
    }) 
 
    const {error} = schema.validate({ 
        name: req.body.name, 
        address: req.body.address, 
        hp: req.body.hp, 
    }) 
 if(error){
    return res
        .status(400)
        .send({status:false,message:error.details[0].message})
 }
    //if found -> update data 
    employee.name = req.body.name 
    employee.address = req.body.address 
    employee.hp = req.body.hp 
     
    res.send({status: true, message: 'employee updated succesfully.'}) 
}) 
 
app.listen(3000, () => console.log('web service running on port 3000...')) 
 
 
// http://localhost:3000/api/employes