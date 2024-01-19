import { Grid } from '@mui/material'
import React from 'react'
import TemplateBlock from './TemplateBlock'

function TemplateBlockList({ templates }: { templates: any[] }) {
    return (
        <Grid
            sx={{ marginTop: '10px',overflowY : 'scroll',height : 'calc(100vh - 150px)' }}
            container
            spacing={1}
        >
            {
                templates.map(template => {
                    return (
                        <Grid item key={template.id} xs={12} sm={6} md={3} lg={4}>
                            <TemplateBlock template={template} />
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

export default TemplateBlockList