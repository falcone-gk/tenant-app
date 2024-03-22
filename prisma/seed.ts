import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hashPassword } from "~/server/utils/bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log('\n')
    console.log('###################################')
    console.log('#      Creating Fixtures...       #')
    console.log('###################################')
    console.log('\n')

    // create admin user
    await prisma.user.upsert({
        where: {
            id: 1
        },
        update: {
            username: process.env.ADMIN_USER as string,
            password: await hashPassword(process.env.ADMIN_PASSWORD as string),
            role: 'admin'
        },
        create: {
            id: 1,
            username: process.env.ADMIN_USER as string,
            password: await hashPassword(process.env.ADMIN_PASSWORD as string),
            role: 'admin'
        }
    })
    console.log('- admin user has been created or updated.')

    // create tenants
    const tenantsData = [
        {
            id: 1,
            code: 'p1_a1',
            reference: 'Cuarto de la tienda.',
            floor: 1
        },        {
            id: 2,
            code: 'p1_a2',
            reference: 'Cuarto entre la cocina y la tienda.',
            floor: 1
        },        {
            id: 3,
            code: 'p2_a1',
            reference: 'Primer cuarto al subir las escaleras.',
            floor: 2
        },        {
            id: 4,
            code: 'p2_a2',
            reference: 'Cuarto al frente de la lavandería del segundo piso.',
            floor: 2
        },        {
            id: 5,
            code: 'p2_a3',
            reference: 'Cuarto que está encima de la cocina.',
            floor: 2
        },        {
            id: 6,
            code: 'p3_a1',
            reference: 'Cuarto de la derecha del tercer piso.',
            floor: 3
        },        {
            id: 7,
            code: 'p3_a2',
            reference: 'Cuarto de la izquierda del tercer piso.',
            floor: 3
        },
    ]

    tenantsData.forEach(async (tenant) => {
        await prisma.tenant.upsert({
            where: {
                id: tenant.id
            },
            create: {
                id: tenant.id,
                code: tenant.code,
                reference: tenant.reference,
                floor: tenant.floor
            },
            update: {
                code: tenant.code,
                reference: tenant.reference,
                floor: tenant.floor
            }
        })
        console.log(`- tenant ${tenant.id} '${tenant.code}' has been created or updated.`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)

    })