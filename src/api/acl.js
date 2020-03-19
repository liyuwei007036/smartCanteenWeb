//acl.js
const aclDirective = {
    inserted: function (el, binding) {
        const hasAuth = function (needAuths, haveAuths) {
            if (needAuths === undefined || needAuths.length === 0) {
                return true
            } else {
                needAuths = needAuths.split(',')
                for (let i in needAuths) {
                    if (haveAuths.includes(needAuths[i])) {
                        return true;
                    }
                }
                return false;
            }
        }
        let $user
        try {
            $user = JSON.parse(sessionStorage.getItem('user'))
        } catch (e) {

        }
        if ($user && $user.id === 1){
            return true;
        }
        let permissions = []
        if ($user) {
            permissions = $user.powers || [];
        }
        if (!hasAuth(binding.value.toString(), permissions)) {
            el.style = "display:none"; //修改元素的可见状态
        }
    }
}

export {
    aclDirective
}
