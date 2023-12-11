import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "./invoice.model"
import Invoice from "../domain/invoice.entity"
import InvoiceItems from "../domain/invoice-items.entity"
import InvoiceRepository from "./invoice.repository"
import { InvoiceItemsModel } from "./invoice-items.model"

describe("Invoice Repository test", () => {

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

    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 10
    })

    const invoiceItem2 = new InvoiceItems({
      id: new Id("2"),
      name: "Item 2",
      price: 20
    })

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      items: [invoiceItem, invoiceItem2],
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const invoiceDB = await InvoiceModel.findOne({ where: { id: "1" } })

    expect(invoiceDB).toBeDefined()
    expect(invoiceDB.id).toEqual(invoice.id.id)
    expect(invoiceDB.name).toEqual(invoice.name)
    expect(invoiceDB.document).toEqual(invoice.document)
    expect(invoiceDB.street).toEqual(invoice.address.street)
    expect(invoiceDB.number).toEqual(invoice.address.number)
    expect(invoiceDB.complement).toEqual(invoice.address.complement)
    expect(invoiceDB.city).toEqual(invoice.address.city)
    expect(invoiceDB.state).toEqual(invoice.address.state)
    expect(invoiceDB.zipcode).toEqual(invoice.address.zipCode)
    expect(invoiceDB.createdAt).toStrictEqual(invoice.createdAt)
    expect(invoiceDB.updatedAt).toStrictEqual(invoice.updatedAt)
  })

  it("should find a invoice", async () => {

    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 10
    })

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      items: [invoiceItem],
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const result = await repository.find(invoice.id.id)

    expect(result.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.address.street)
    expect(result.address.number).toEqual(invoice.address.number)
    expect(result.address.complement).toEqual(invoice.address.complement)
    expect(result.address.city).toEqual(invoice.address.city)
    expect(result.address.state).toEqual(invoice.address.state)
    expect(result.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
  })
})