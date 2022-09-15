import type { NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import NextCors from "nextjs-cors";
import type {respostaPadraoMsg} from "../types/respostaPadraoMsg"

export const politicaCors = (handler : NextApiHandler) =>
async(req : NextApiRequest , res : NextApiResponse<respostaPadraoMsg>) =>{
    try{
        await NextCors(req,res,{
            origin : '*',
            method : ['GET,POST,PUT'],
            optionsSuccessStatus : 200,
        });
        return handler (req,res);
    }catch(e){
        console.log('Erro ao tratar a politica de CORS:', e);
        return res.status(500).json({erro : 'Ocorreu um erro ao tratar politica de CORS'})

        }
}