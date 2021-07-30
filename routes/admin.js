const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

//Rotas GET
    router.get("/", (req, res) => {res.render("admin/index")})
    router.get("/posts", (req, res) => {res.send("Pagina de Posts")})
    router.get("/categorias", (req, res) => {
        Categoria.find().sort({date: 'desc'}).then((categorias) => {
            res.render("admin/categorias", {categorias: categorias.map(categorias => categorias.toJSON())})
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar as categorias")
            res.redirect("/admin")
        })
        })
    router.get("/categorias/add", (req, res) => {res.render("admin/addcategoria")})
    router.get("/categorias/edit/:id", (req, res) => {
        Categoria.findOne({__id: req.params.id}).lean().then((categoria) => {
            res.render("admin/editcategorias", {categoria: categoria})
        }).catch((err) => {
            req.flash("error_msg", "Essa categoria não existe!")
            res.redirect("/admin/categorias")
        })
        
    })

//Rotas POST
    router.post("/categorias/nova", (req, res) => {

        var erros = []

    //Nome
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({texto: "Nome Inválido!"})
        }
        if(req.body.nome.length < 3) {
            erros.push({texto: "Nome muito pequeno!"})
        }

    //Slug
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({texto: "Slug inválido!"})
        }

    //Array
        if(erros.length > 0) {
            res.render("admin/addcategoria", {erros: erros})
        }else{
        
        //Cria categorias no banco de dados
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
                new Categoria(novaCategoria).save().then(() => {
                    req.flash('success_msg', 'Categoria criada com sucesso!')
                    res.redirect("/admin/categorias")
                }).catch ((err) => {
                    req.flash('erros_msg', 'Erro ao salvar a categoria, tente novamente!')
                    res.redirect("/admin")
                })
            }


    
    })

    router.post("/categorias/deletar", (req, res) => {
        Categoria.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Categoria Deletada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao deletar a categoria!")
            res.redirect("/admin/categorias")
        })
    })















module.exports = router