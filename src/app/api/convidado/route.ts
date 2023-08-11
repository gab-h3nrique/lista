import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../db/prisma"

// 200 OK
// 201 Created
// 202 Accepted
// 203 Non-Authoritative Information
// 204 No Content
// 205 Reset Content
// 206 Partial Content

// 400 Bad Request
// 401 Unauthorized
// 402 Payment Required
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 406 Not Acceptable
// 429 Too Many Requests
// 500 Internal Server Error
// 501 Not Implemented
// 502 Bad Gateway
// 503 Service Unavailable

export async function GET(req: Request) {



    return new Response( JSON.stringify( { convidados: await prisma.convidados.findMany() } ) , { status: 200 });

    

}

export async function POST(request: Request) {

    const convidado = await request.json()

    const convidadoDb = await prisma.convidados.create({ data: convidado })

    return new Response( JSON.stringify( {convidado: convidadoDb} ) , { status: 201 });

}