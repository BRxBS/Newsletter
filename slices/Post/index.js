import React from 'react'
import { PrismicRichText } from '@prismicio/react'

const Post = ({ slice }) => (
  <section>
    <PrismicRichText field={slice.primary.title} /> hello
    <PrismicRichText field={slice.primary.component} /> oii
   
  </section>
);

export default Post