import { Id } from "../../../core/build";

async function generateId() {
    const id = Id.generateId().value;
    console.log(id);
}

generateId();
