import { Image } from "../SocialMedia/Image.class";
import { Post } from "../SocialMedia/Post.class";
import { Tag } from "../SocialMedia/types/Tag";
import { ArweaveTransaction } from "./ArweaveTransaction.class";

export class ArweaveImage extends ArweaveTransaction {
    protected readonly _image:Image;
    protected readonly _type:string = "image";
    protected readonly _tags = [
        {name:"Content-Type", value:"image/jpeg"},
        {name:"App-Name", value:"Lookso"}
    ];

    constructor(image:Image, txId?:string, tags?:Tag[]) {
        super(txId);
        tags?.forEach((tag) => { tags.push(tag)})
        this._image = image;
    }

    get image(): Image {
        return this._image;
    }

    get tags(): Tag[] {
        return this._tags;
    }

    get type():string {
        return this._type;
    }

}