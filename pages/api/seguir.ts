import type { NextApiRequest, NextApiResponse } from "next";
import { useAmp } from "next/amp";
import { conectamongoDB } from '../../middlewares/conectamongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import { SeguidorModel } from "../../models/SeguidorModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const endpointSeguir = 
async (req : NextApiRequest , res : NextApiResponse<respostaPadraoMsg | any>) => {
    try{
        if(req.method === 'PUT'){
            const {userId , id }= req?.query;

            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuario logado nao encontrado'})

            }
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({erro : 'Usuario a ser seguido nao encontrado'})

            }
            const euJaSigoEsteUsuario = await SeguidorModel.
            find({usuarioId : usuarioLogado._id ,usuarioSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsteUsuario && euJaSigoEsteUsuario.length >0){
                euJaSigoEsteUsuario.forEach(async(e : any) =>  await SeguidorModel.findByIdAndDelete({_id : e._id}));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndDelete({_id : usuarioLogado._id},usuarioLogado);
                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndDelete({_id : usuarioASerSeguido._id},usuarioASerSeguido);

                return res.status(200).json({msg : 'Deixou de seguir com sucesso'});

            }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);

                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido)
               
                return res.status(200).json({msg: 'Usuario seguido com sucesso'});
            }

        }

        return res.status(405).json({erro :'Metodo informado nao e valido'})

    }catch(e){
        console.log(e);
        return res.status(500).json({erro: 'Nao foi possivel seguir/deseguir o usuario'});

    }
}
export default validarTokenJWT(conectamongoDB(endpointSeguir));