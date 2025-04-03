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
        if (cnpj.Length != 12 || !cnpj.All(char.IsLetterOrDigit))
        {
            throw new ArgumentException("CNPJ alfanumérico inválido.");
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
        return new string(cnpj.Select(c =>
        {
            if (char.IsDigit(c)) return c;
            if (char.IsLetter(c) && char.IsUpper(c)) return (char)((c - 'A') + 17 + '0');
            return '\0'; // Caractere inválido
        }).Where(c => c != '\0').ToArray());
    }
}

class Program
{
    static async Task Main(string[] args)
    {
        CNPJService service = new CNPJService();

        try
        {
            var cnpjInfo = await service.ConsultarCNPJ("12ABC34501DE");
            Console.WriteLine(cnpjInfo);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
```