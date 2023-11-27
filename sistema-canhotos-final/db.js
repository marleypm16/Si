import postgres from "postgres";
import "dotenv/config";
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

console.log(PGHOST);
console.log(PGPASSWORD);
const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  // ssl: "require",
  // connection: {
  //   options: `project=${ENDPOINT_ID}`,
  // },
});

export const get_emissores = async () => {
  try {
    return await sql`SELECT * FROM emissores`;
  } catch (error) {
    throw error;
  }
};

export const get_emissores_especificos = async (id) => {
  try {
    return await sql`SELECT * FROM emissores WHERE id = ${id}`;
    
  } catch (error) {
    throw error;
  }
}

export const novo_emissor = async (body) => {
  try {
    const { razao_social, cnpj } = body;
    return await sql`INSERT INTO EMISSORES (razao_social, cnpj)
    VALUES (${razao_social},${cnpj})`;
    
  } catch (error) {
    throw error;
  }
};

export const get_notas = async () => {
  try {
    return await sql`SELECT * FROM notas`;

  } catch (error) {
    throw error;
  }
};
  
export const get_notas_especificas_num_nota_id_emissor = async (id) => {
  try {
    // const VerificarSeHaDigitos = /^[0-9]+$/; // Expressão regular para verificar se contém somente dígitos

    // if (VerificarSeHaDigitos.test(id)) {
    //   // Se o ID contém apenas dígitos (números)
    //   const response = await sql`SELECT * FROM notas WHERE numero_da_nota = ${id}`;
    //   return response;
    // } else {
      // Se o ID contém caracteres que não são números (letras, etc.)
      return await sql`SELECT * FROM notas WHERE id_emissor = ${id}`;
    
  } catch (error) {
    throw error;
  }
}
export const getNotaPorNumero = async (id) => {
  try {
    // const VerificarSeHaDigitos = /^[0-9]+$/; // Expressão regular para verificar se contém somente dígitos

    // if (VerificarSeHaDigitos.test(id)) {
    //   // Se o ID contém apenas dígitos (números)
    //   const response = await sql`SELECT * FROM notas WHERE numero_da_nota = ${id}`;
    //   return response;
    // } else {
      // Se o ID contém caracteres que não são números (letras, etc.)
      return await sql`SELECT * FROM notas WHERE id = ${id}`;
    
  } catch (error) {
    throw error;
  }
}



// export const get_notas_especificas_alterar = async (id) =>{
//   try {
//     const response = await sql`SELECT * FROM notas WHERE numero_da_nota = ${id}`;
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

export const atualizarNotas = async (body,id,caminho_imagem) => {
  const {numero,status,data_emissao,motorista,imagem} = body
  try {
    const response = await sql`UPDATE notas SET numero = ${numero},status = ${status}, data_emissao=${data_emissao},motorista = ${motorista},caminho_imagem = ${caminho_imagem},imagem=${imagem} WHERE id = ${id}`;
    return response;
  } catch (error) {
    throw error;
  }
}

export const nova_nota = async (body) => {
  try {
    console.log(body)
    const { numero, motorista,status,data_emissao,id_emissor } = body;
    const response = await sql`INSERT INTO notas (data_emissao, id_emissor,motorista,numero,status)
    VALUES (${data_emissao},${id_emissor},${motorista},${numero},${status})`;
    
    return response
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const DeletarNota = async (id) =>{
  try {
    const response = await sql`DELETE FROM notas WHERE numero_da_nota = ${id}`;
    return response;
  } catch (error) {
    throw error;
  }
}