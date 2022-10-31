const { response } = require('express');
const { Brand } = require('../models');



const getBrands = async(req, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [ total, brands ] = await Promise.all([
        Brand.countDocuments(query),
        Brand.find(query)
            .populate('user', 'name')
            .skip( Number( from ) )
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        brands
    });
}

const getBrand = async(req, res = response ) => {

    const { id } = req.params;
    const brand = await Brand.findById( id )
                            .populate('user', 'name');

    res.json( brand );

}

const postBrand = async(req, res = response ) => {

    const name = req.body.name.toUpperCase();

    const brandDB = await Brand.findOne({ name });

    if ( brandDB ) {
        return res.status(400).json({
            msg: `La marca ${ brandDB.name }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const brand = new Brand( data );

    // Guardar DB
    await brand.save();

    res.status(201).json(brand);

}

const putBrand = async( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name  = data.name.toUpperCase();
    data.user = req.user._id;

    const brand = await Brand.findByIdAndUpdate(id, data, { new: true });

    res.json( brand );

}

const deleteBrand = async(req, res =response ) => {

    const { id } = req.params;
    const deleteBrand = await Brand.findByIdAndUpdate( id, { state: false }, {new: true });

    res.json( deleteBrand );
}




module.exports = {
    postBrand,
    getBrands,
    getBrand,
    putBrand,
    deleteBrand
}