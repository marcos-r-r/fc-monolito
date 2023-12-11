import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {

  it("should generate a invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const invoiceItem = {
      id: "1",
      name: "Item 1",
      price: 10
    }
    
    const invoiceItem2 = {
      id: "2",
      name: "Item 2",
      price: 20
    }
    
    const invoice = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      items: [invoiceItem, invoiceItem2],
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      total: 30 
    }

    const result =  await usecase.execute(invoice)

    expect(result.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.street).toEqual(invoice.street)
    expect(result.number).toEqual(invoice.number)
    expect(result.complement).toEqual(invoice.complement)
    expect(result.city).toEqual(invoice.city)
    expect(result.state).toEqual(invoice.state)
    expect(result.zipCode).toEqual(invoice.zipCode)
  })
})