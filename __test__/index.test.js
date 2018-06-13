import fetch from 'isomorphic-fetch';

const getUser = url => {
    return fetch(url).then(res => res.json());
};

test('async test', async () => {
    const url = 'https://api.github.com/users/zzcwoshizz';
    const user = await getUser(url);
    expect(user.url).toBe(url);
});
