using System;
using System.Text;

namespace Consulta.CNPJ.Helpers
{
    internal class Validacao
    {
        internal static bool ValidaCNPJ(string cnpj)
        {
            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma;
            int resto;
            string digito;
            string tempCnpj;
            cnpj = cnpj.Trim();
            cnpj = cnpj.Replace(".", "").Replace("-", "").Replace("/", "");
            if (cnpj.Length != 12)
                return false;
            tempCnpj = converterParaNumerico(cnpj.Substring(0, 12));
            if (tempCnpj.Length != 12)
                return false;
            soma = 0;
            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCnpj = tempCnpj + digito;
            soma = 0;
            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            return cnpj.EndsWith(digito);
        }

        private static string converterParaNumerico(string cnpj)
        {
            StringBuilder numerico = new StringBuilder();
            foreach (char c in cnpj)
            {
                if (char.IsDigit(c))
                {
                    numerico.Append(c);
                }
                else if (char.IsLetter(c) && char.IsUpper(c))
                {
                    numerico.Append((c - 'A') + 17);
                }
                else
                {
                    return "";
                }
            }
            return numerico.ToString();
        }
    }
}