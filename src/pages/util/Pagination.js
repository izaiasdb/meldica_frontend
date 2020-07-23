import React from 'react'

const showTotal = (total, range) => `${range[0]}-${range[1]} de ${total} itens.`

const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <a>&nbsp;Anterior&nbsp;</a>;
    }
    if (type === 'next') {
      return <a>&nbsp;Próximo&nbsp;</a>;
    }
    return originalElement;
}

const Pagination = (pageSize = 10,
                    size = 'small',
                    showQuickJumper = true,
                    showSizeChanger = true,
                    pageSizeOptions = ['10','20','30','40','60']) => ({
    showSizeChanger,
    pageSizeOptions,
    size,
    pageSize,
    showTotal,
    showQuickJumper,
    itemRender
})

export default Pagination;
