import { Slide } from 'react-slideshow-image'
import styles from './ProductSlideShow.module.css';
import 'react-slideshow-image/dist/styles.css'

interface Props {
    images: string[]
}

export const ProductSlideshow = ({ images }: Props) => {
    return (
        <Slide easing='ease' duration={700} indicators>
            {
                images.map((image, index) => {
                    const url = image.includes('http') ? image : `/products/${image}`;
                    return (
                        <div className={styles['each-slide']} key={image}>
                            <div style={{
                                backgroundImage: `url(${url})`,
                                backgroundSize: 'cover',
                            }}>

                            </div>
                        </div>
                    )
                })

            }
        </Slide>
    )
}