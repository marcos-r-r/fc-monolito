import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import InvoiceFacade from "./invoice.facade"
import { InvoiceItemsModel } from "../repository/invoice-items.model"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"


describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const repository = new InvoiceRepository()
    const generateUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    })

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
    
    const input = {
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

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(input.id)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.street)
    expect(invoice.number).toBe(input.number)
    expect(invoice.complement).toBe(input.complement)
    expect(invoice.city).toBe(input.city)
    expect(invoice.state).toBe(input.state)
    expect(invoice.zipcode).toBe(input.zipCode)
  })

  it("should find a invoice", async () => {
      
      // const repository = new InvoiceRepository()
      // const generateUsecase = new GenerateInvoiceUseCase(repository)
      // const findUseCase = new FindInvoiceUseCase(repository)
      // const facade = new InvoiceFacade({
      //   generateUsecase: generateUsecase,
      //   findUsecase: findUseCase,
      // })
  
      const facade = InvoiceFacadeFactory.create()

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
      
      const input = {
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
  
      await facade.generate(input)
  
      const invoice = await facade.find({ id: "1" })
  
      expect(invoice).toBeDefined()
      expect(invoice.id).toBe(input.id)
      expect(invoice.name).toBe(input.name)
      expect(invoice.document).toBe(input.document)
      expect(invoice.address.street).toBe(input.street)
      expect(invoice.address.number).toBe(input.number)
      expect(invoice.address.complement).toBe(input.complement)
      expect(invoice.address.city).toBe(input.city)
      expect(invoice.address.state).toBe(input.state)
      expect(invoice.address.zipCode).toBe(input.zipCode)
    }
  )


  // it("should find a invoice", async () => {

  //   // const repository = new ClientRepository()
  //   // const addUsecase = new AddClientUseCase(repository)
  //   // const findUseCase = new FindClientUseCase(repository)
  //   // const facade = new ClientAdmFacade({
  //   //   addUseCase: addUsecase,
  //   //   findUseCase: findUseCase
  //   // })

  //   // const facade = ClientAdmFacadeFactory.create()

  //   const input = {
  //     id: "1",
  //     name: "Lucian",
  //     email: "lucian@xpto.com",
  //     document: "1234-5678",
  //     address: new Address(
  //       "Rua 123",
  //       "99",
  //       "Casa Verde",
  //       "Criciúma",
  //       "SC",
  //       "88888-888"
  //     )
  //   }

  //   await facade.add(input)

  //   const client = await facade.find({ id: "1" })

  //   expect(client).toBeDefined()
  //   expect(client.id).toBe(input.id)
  //   expect(client.name).toBe(input.name)
  //   expect(client.email).toBe(input.email)
  //   expect(client.document).toBe(input.document)
  //   expect(client.address.street).toBe(input.address.street)
  //   expect(client.address.number).toBe(input.address.number)
  //   expect(client.address.complement).toBe(input.address.complement)
  //   expect(client.address.city).toBe(input.address.city)
  //   expect(client.address.state).toBe(input.address.state)
  //   expect(client.address.zipCode).toBe(input.address.zipCode)
  // })
})