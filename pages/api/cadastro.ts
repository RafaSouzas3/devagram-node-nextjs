import type {NextApiRequest,NextApiResponse} from "next";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import type {UsuarioRequisicao} from "../../types/UsuarioRequisicao";

const endpointCadastro =
    (req :NextApiRequest, res :NextApiResponse<respostaPadraoMsg>) => {

        if(req.method === 'POST'){
            const usuario = req.body as UsuarioRequisicao;
        }

        return res.status(400).json({erro : 'Metodo informado nao e valido'})
    }