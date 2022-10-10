async function sendApis(
	ids,
	promises,
	infos = [],
	errors = [],
	start = 0,
	end = 4
) {
	const curIds = ids.slice(start, end);
	const curPromises = promises.slice(start, end);
	const resArr = await Promise.allSettled(curPromises);
	resArr.forEach(({ status, value = null, reason = null }, index) => {
		if (status === "fulfilled") {
			infos.push({
				id: curIds[index],
				name: value,
			});
		} else {
			errors.push({
				id: curIds[index],
				msg: reason,
			});
		}
	});
	if (end < ids.length - 1) {
		await sendApis(ids, promises, infos, errors, start + end, end + end);
	}
	return { infos, errors };
}
function getAllInfo() {
	return new Promise((resolve, reject) => {
		getList()
			.then(ids => {
				if (ids.length === 0) {
					resolve([]);
					return;
				}
				const promises = ids.reduce((apis, id) => {
					apis.push(getInfo(id));
					return apis;
				}, []);
				sendApis(ids, promises)
					.then(({ infos, errors }) => {
						if (errors.length !== 0) {
							// 没跑成功的getinfo id 处理
						}
						resolve(infos);
					})
					.catch(err => {
						reject(err);
					});
			})
			.catch(err => {
				reject(err);
			});
	});
}
getAllInfo()
	.then(res => {
		console.log(res);
	})
	.catch(err => {
		console.log(err);
	});
/**
 * ceshi
 */
function getList() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve([1, 2, 3, 4, 5, 7, 6, 5, 4, 6, 7, 8, 9, 6, 6, 6, 6]);
		}, 1000);
	});
}
function getInfo(id) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve("name");
		}, 1000);
	});
}
