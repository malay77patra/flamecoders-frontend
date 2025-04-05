import React from 'react';

function CustomIcon({
    svg,
    size = '1em',
    color = 'currentColor',
    style,
    className,
    title,
    ...props
}) {
    if (!svg) return null;

    return React.cloneElement(svg, {
        width: size,
        height: size,
        fill: color,
        style: { ...svg.props.style, ...style },
        className: [svg.props.className, className].filter(Boolean).join(' '),
        role: title ? 'img' : 'presentation',
        'aria-label': title,
        ...props
    });
}

export default CustomIcon;
