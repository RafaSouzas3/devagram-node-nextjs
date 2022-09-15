import type {NextApiRequest , NextApiResponse } from "next";
import{conectamongoDB} from "../../middlewares/conectamongoDB";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import type {LoginResposta} from "../../types/LoginResposta";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from "jsonwebtoken";
import { politicaCors } from "../../middlewares/politicaCors";

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<respostaPadraoMsg | LoginResposta>
) => {
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro : 'ENV JWT nao informado'});
    }
    if(req.method === 'POST'){
        const {login,senha} = req.body;

        const usuarioEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuarioEncontrados && usuarioEncontrados.length > 0){
            const usuarioEncontrado = usuarioEncontrados[0];

            const token = jwt.sign({_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT);

                return res.status(200).json({
                    nome : usuarioEncontrado.nome , 
                    email : usuarioEncontrado ,
                    token});
            }
            return res.status(405).json({erro : 'Usuario ou senha nao encontrado'});
    }
    return res.status(400).json({erro : 'Metodo informado nao e valido'})
}
export default politicaCors (conectamongoDB(endpointLogin));