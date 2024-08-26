"use client";

import Image from 'next/image';
import React, { useState } from 'react';

const ProductImages = ({ post }) => {
    const [index, setIndex] = useState(0);

    return (
        <div>
            <div className="h-[500px] relative">
                <Image
                    src={post[index]}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex justify-between gap-4 mt-8">
                {post.map((img, i) => (
                    <div
                        key={i}
                        className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
                        onClick={() => setIndex(i)}
                    >
                        <Image
                            src={img}
                            alt=""
                            fill
                            sizes="30vw"
                            className="object-cover rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
