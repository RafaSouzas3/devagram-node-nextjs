import type { NextApiRequest , NextApiResponse } from "next";
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectamongoDB } from "../../middlewares/conectamongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndPoint = async(req : NextApiRequest , res : NextApiResponse <respostaPadraoMsg | any>) => {

    try{
        const{userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);

    }catch(e){
            console.log(e);
            res.status(400).json({erro :'Nao foi possivel obter dados do ususario'})
        }
    }


export default validarTokenJWT (conectamongoDB(usuarioEndPoint));