# Modelo textual — Informação SEI (SGS)

Referência: `templates/SEI_0117491_Informacao.pdf`
(Informação SGS 273/2026, documento SEI 0117491, processo 2026/8.26.000012506.5).

A saída do app é **texto para copiar e colar no editor do SEI**. A assinatura eletrônica é lançada no próprio SEI após a colagem — não reproduza o rodapé de autenticidade.

## Estrutura observada no modelo

```
Processo SEI nº {{processo}}
Assunto: {{assunto}}
Informação SGS nº {{numeroInformacao}}
{{vocativo}}

{{corpo}}

À consideração superior para deliberação.
```

Vocativo típico:

```
Ilmo. Sr. [nome],
Secretário de Governança de Sistemas
```

Corpo:
- Começa situando o expediente (“Trata-se de…”, “Em cumprimento ao r. despacho…”).
- Parágrafos corridos; numeração 1. 2. 3. só quando ajudar a leitura.
- Encerra com encaminhamento (secretarias, Presidência, CGJ) e “À consideração superior para deliberação.”
- Campos ausentes: [COMPLETAR]. Inferências: [VERIFICAR].
