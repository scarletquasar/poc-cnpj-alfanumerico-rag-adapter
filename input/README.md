```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;

public class CNPJService
{
    private readonly HttpClient _httpClient;

    public CNPJService()
    {
        _httpClient = new HttpClient();
    }

    public async Task<string> ConsultarCNPJ(string cnpj)
    {
        if (cnpj.Length != 12)
        {
            throw new ArgumentException("CNPJ alfanumérico deve ter 12 caracteres.");
        }

        string cnpjNumerico = ConverterParaNumerico(cnpj);
        if (cnpjNumerico.Length != 12)
        {
            throw new ArgumentException("CNPJ alfanumérico inválido.");
        }

        string url = $"https://www.receitaws.com.br/v1/cnpj/{cnpjNumerico}";
        HttpResponseMessage response = await _httpClient.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            throw new HttpRequestException("Erro ao consultar CNPJ.");
        }
    }

    private string ConverterParaNumerico(string cnpj)
    {
        return string.Concat(cnpj.Select(c =>
        {
            if (char.IsDigit(c)) return c - '0';
            if (char.IsLetter(c)) return (c - 'A') + 17;
            return -1; // Caracter inválido
        }).Where(v => v >= 0));
    }
}

class Program
{
    static async Task Main(string[] args)
    {
        CNPJService service = new CNPJService();
        string cnpj = "12ABC34501DE"; // Exemplo de CNPJ alfanumérico
        try
        {
            var resultado = await service.ConsultarCNPJ(cnpj);
            Console.WriteLine(resultado);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
```