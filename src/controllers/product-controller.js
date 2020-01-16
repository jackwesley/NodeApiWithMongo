'use-strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azureStorage = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);

    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug)
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id)
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tag)
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A description deve conter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        //create a Blob Service
        // const blobService = azureStorage.createBlobService(config.containerConnectionString);

        // let fileName = guid.raw().toString() + '.jpg';
        // let rawdata = req.body.image;
        // let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // let type = matches[1];
        // let buffer = new Buffer(matches[2], 'base64');
        // //Save image
        // await blobService.createBlockBlobFromText('product-images', fileName, buffer, {
        //     contentType: type
        // }, function(error, result, response){
        //     if(error){
        //         fileName = 'default-product.png'
        //     }
        // });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price:req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'url_blob_no_storage' + 'default-product.png' // Caso blob fubcione adicione retire o default-product.png e deixe o fileName
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: error.message
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        var data = repository.update(req.params.id, req.body)
        res.status(200).send({
            message: 'Produto atualizado com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao atualizar produto',
            data: error
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        var data = await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            data: error
        });
    }
};

