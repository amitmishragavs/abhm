import { Tabs as ATabs } from 'antd'
import React, { useEffect, useState } from 'react'
import './tabs.scss'

const { TabPane } = ATabs;

function Tabs({ children, titles = [], active = "0",...props }: any) {
    const [activeTab, setActiveTab] = useState(active)
    useEffect(() => {
        if (active !== activeTab) {
            setActiveTab(active)
        }
    }, [active])

    return (
        <ATabs className='tab-wrapper' activeKey={activeTab} onChange={setActiveTab} {...props}>
            {Array.isArray(children) ? children.map((child, i) => <TabPane tab={titles[i]} key={i}>
                {child}
            </TabPane>) : <TabPane tab={titles[0]} key="0">
                {children}
            </TabPane>}
        </ATabs>
    )
}

export default Tabs