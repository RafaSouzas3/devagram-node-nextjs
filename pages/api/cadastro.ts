import type {NextApiRequest,NextApiResponse} from "next";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import type {UsuarioRequisicao} from "../../types/UsuarioRequisicao";
import {UsuarioModel} from '../../models/UsuarioModel';
import {conectamongoDB} from '../../middlewares/conectamongoDB';
import md5 from "md5";
import { upload ,uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import nc from 'next-connect';

const handler = nc ()

.use(upload.single('file'))
.post(async(req :NextApiRequest, res :NextApiResponse<respostaPadraoMsg>) =>{ 
                const usuario = req.body as UsuarioRequisicao;
                if(!usuario.nome || usuario.nome.length < 2){
                    return res.status(400).json({erro : 'Nome invalido'});
                }
                if(!usuario.email || usuario.email.length < 5 
                    || !usuario.email.includes ('@')
                    || !usuario.email.includes ('.')){
                        return res.status(400).json({erro : 'Email invalido'});
                    }
                if(!usuario.senha || usuario.senha.length < 4){
                    return res.status(400).json({erro : 'Senha invalida'}); 
                   }
                   //Validacao se ja existe usuario com o mesmo email
                   const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
                   if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                    return res.status(400).json({erro :'Ja existe uma conta com email informado'});
                   }

                   // enviar a imagem do multer para cosmic
                   const image = await uploadImagemCosmic(req);
                  
                   //Salvar no banco de dados
                   const usuarioASerSalvo = {
                    nome : usuario.nome,
                    email : usuario.email,
                    senha : md5(usuario.senha),
                    avatar : image?.media?.url
                   }
                await UsuarioModel.create(usuarioASerSalvo);
                return res.status(200).json({ msg:'Usuario criado com sucesso'});
});

export const config = {
    api:{
        bodyParser: false
    }
}

export default conectamongoDB(handler);