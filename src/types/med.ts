import {prisma} from "../init.ts";

export async function add_med(name: string, chat_id: number, cron: string) {
    return await prisma.med.create({
        data: {
            name: name,
            cron: cron,
            chat_id: chat_id,
        },
    })
}

export async function get_meds(chat_id: number) {
    return await prisma.med.findMany({
        where: {
            chat_id: chat_id,
        },
    });
}

export async function get_med(id: number) {
    return await prisma.med.findFirst({
        where: {
            id: id,
        },
    });
}

export async function delete_med(med_id: number) {
    return await prisma.med.delete({
        where: {
            id: med_id
        },
    });
}