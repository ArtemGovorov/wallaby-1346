const loadA = async () => {
    return await import('app/a');
};

it('should resolve dynamic import', async () => {
    const result = await loadA();
    console.log(result);
});
