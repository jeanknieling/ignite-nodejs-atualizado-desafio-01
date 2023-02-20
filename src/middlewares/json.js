export async function json(req, res) { // Função para tratar os pedaços de dados vindos pela rota
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  res.setHeader('Content-Type', 'application/json'); // Explícita que os dados estão no formato JSON
}
