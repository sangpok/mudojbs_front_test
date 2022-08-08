const ATTACHED_VIEW = (target) => {
    return new CustomEvent('ATTACHED_VIEW', {
        detail: {
            target,
        },
    });
};

const ATTACHED_COMPONENT = (type, target) => {
    return new CustomEvent('ATTACHED_COMPONENT', {
        detail: {
            target,
            type,
        },
    });
};

export default { ATTACHED_VIEW, ATTACHED_COMPONENT };
