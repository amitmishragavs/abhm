import { Card } from 'antd';
import React from 'react'
import './cardwrapper.scss';

function CardWrapper({ children, title, form, className, ...props }: any) {
  return (
    <div className={`GCard ${className}`} {...props}>
      <Card.Grid className="card">
        <h5 className='card-header'>{title} </h5>
        <div className={form && "card-form"}>
          {children}
        </div>
      </Card.Grid>
    </div>
  )
}

export default CardWrapper