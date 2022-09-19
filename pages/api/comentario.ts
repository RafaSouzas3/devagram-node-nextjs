import type { NextApiRequest, NextApiResponse } from "next";
import { conectamongoDB } from "../../middlewares/conectamongoDB";
import { politicaCors } from "../../middlewares/politicaCors";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const comentarioEndpoint = async(req : NextApiRequest , res : NextApiResponse<respostaPadraoMsg | any> ) =>{
    try{
        if (req.method === 'PUT'){
            const {userId , id} = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if (!usuarioLogado){
                return res.status(400).json({erro: 'Usuario nao encontrado'})
            }
            const publicacao = await PublicacaoModel.findById(id);
            if (!publicacao){
                return res.status(400).json({erro : 'Publicacao nao encontrada'})
            }
            if (!req.body || !req.body.comentario 
                || req.body.comentario.length < 2){
                return res.status(400).json({erro: 'Comentario nao e valido'})
            }
            const comentario = {
                usuarioId : usuarioLogado.id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }
            publicacao.comentarios.push(comentario);
            await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
            return res.status(200).json({msg : 'Comentario adicionado com sucesso'})
        }
          return res.status(405).json({erro:'Metodo informado nao e valido'})  
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Ocoreeu erro ao adicionar comentario'});
    }
    
}
export default politicaCors (validarTokenJWT(conectamongoDB(comentarioEndpoint)));