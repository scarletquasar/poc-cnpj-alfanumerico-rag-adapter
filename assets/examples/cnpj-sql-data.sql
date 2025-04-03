-- Exemplo cliente
CREATE TABLE BrazilianCustomers (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT, -- Unique Customer Identifier
    CustomerName NVARCHAR(255) NOT NULL,       -- Name of the customer
    CNPJ NVARCHAR(12) NOT NULL,                -- Alphanumeric CNPJ (Brazilian ID)
    ContactNumber NVARCHAR(15),                -- Contact number
    Address NVARCHAR(255),                     -- Address of the customer
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp for record creation
);

-- Exemplo boleto bancário PJ
CREATE TABLE Boleto (
    Local_Pagamento VARCHAR(255),            -- Local onde o boleto pode ser pago
    Beneficiario VARCHAR(255),               -- Nome do beneficiário
    CNPJ_Beneficiario NVARCHAR(12),          -- CNPJ alfanumérico do beneficiário
    Endereco_Beneficiario VARCHAR(255),      -- Endereço do beneficiário
    Data_Documento DATE,                     -- Data de emissão do documento
    Numero_Documento VARCHAR(20),            -- Número do documento
    Especie_Documento VARCHAR(10),           -- Espécie do documento
    Aceite CHAR(1),                          -- Indica se há aceite (S/N)
    Data_Processamento DATE,                 -- Data de processamento
    Nosso_Numero VARCHAR(20),                -- Identificação do boleto pelo banco
    Carteira INT,                            -- Código da carteira
    Quantidade INT,                          -- Quantidade de itens
    Valor DECIMAL(10, 2),                    -- Valor do boleto
    Vencimento DATE,                         -- Data de vencimento
    Agencia_Codigo_Beneficiario VARCHAR(20), -- Agência e código do beneficiário
    Valor_Documento DECIMAL(10, 2),          -- Valor total do documento
    Descontos_Abatimentos DECIMAL(10, 2),    -- Valor de descontos ou abatimentos
    Mora_Multa DECIMAL(10, 2),               -- Valor de mora ou multa
    Valor_Cobrado DECIMAL(10, 2),            -- Valor cobrado
    Pagador VARCHAR(255),                    -- Nome do pagador
    CNPJ_CPF_Pagador NVARCHAR(12),           -- CNPJ ou CPF do pagador
    Sacador_Avalista VARCHAR(255)            -- Nome do sacador avalista
);

-- Inserção de dados fictícios na tabela boleto bancário PJ
INSERT INTO Boleto (
    Local_Pagamento, Beneficiario, CNPJ_Beneficiario, Endereco_Beneficiario, Data_Documento, 
    Numero_Documento, Especie_Documento, Aceite, Data_Processamento, Nosso_Numero, 
    Carteira, Quantidade, Valor, Vencimento, Agencia_Codigo_Beneficiario, 
    Valor_Documento, Descontos_Abatimentos, Mora_Multa, Valor_Cobrado, 
    Pagador, CNPJ_CPF_Pagador, Sacador_Avalista
) VALUES (
    'Pagável em qualquer banco até o vencimento.', 
    'Saraiva e Siciliano SA', '61ABC284D001', 
    'Rua Henrique Schaumann, 2070, Cerqueira César, São Paulo, SP, 05413-909',
    '2025-04-02', '04357959', 'DM', 'N', '2025-04-02', 
    '176/04357959-0', 176, NULL, 67.49, '2025-04-05', 
    '2938/11051-3', 67.49, 0.00, 0.00, 67.49, 
    'Lucas Gabriel Casagrande', '12XYZ3456AB0', NULL
);