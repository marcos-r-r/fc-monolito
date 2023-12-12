import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {

    const items = input.items.map((item) => ({
      id: new Id(item.id),
      name: item.name,
      price: item.price,
    }));
    const invoiceItens = items.map((item) => new InvoiceItems(item));
    
    const props = {
      id: new Id(input.id),
      name: input.name,
      document: input.document,
      items: invoiceItens,
      total: input.total,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode
      ),
    };

    const invoice = new Invoice(props);
    await this._invoiceRepository.generate(invoice);

    return {
      id: input.id,
      name: input.name,
      document: input.document,
      items: input.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: input.total,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    };
  }
}
