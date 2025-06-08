import React from 'react';

export function Table({
  column,
  data,
  onEdit,
  onDelete,
  onAddPresence,
  onReturnGame,
  onRowClick,
  hasEdit = true,
  hasDelete = true,
  hasAddPresence = true,
  hasReturnGame = false,
  hasGreenButton = false,
  greenButtonContent,
  onGreenButtonPress,
  hasAddPlayer = false,
  onAddPlayer,
  customButton
}) {
  if (!Array.isArray(data)) {
    return <div>Carregando...</div>; // Ou outro indicador de carregamento
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full min-w-208 mx-auto border-collapse border border-gray-800">
        <thead>
          <tr className="bg-amber-400 border border-zinc-800 text-black">
            {column.map((coluna, index) => (
              <th key={index} className="px-4 py-2 text-left text-lg">
                {coluna}
              </th>
            ))}
            {(hasEdit || hasDelete || hasAddPresence || hasReturnGame || hasGreenButton || hasAddPlayer) && (
              <th className="px-4 py-2 text-left text-lg"></th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0
                ? 'bg-[#FEF3C7] border border-zinc-800'
                : 'bg-zinc-800 text-white border border-zinc-800'
                } hover:opacity-70`}
              onClick={() => onRowClick(item._id)}
            >
              {Object.keys(item).map((key, i) => {
                if (key === '_id') return null;
                return (
                  <td key={i}>
                    <div className="flex items-center px-4 py-2 text-2xl">
                      {item[key]}
                    </div>
                  </td>
                );
              })}
              {(hasEdit || hasDelete || hasAddPresence || hasReturnGame || hasGreenButton || hasAddPlayer) && (
                <td >
                  <div className="px-7 flex gap-[30px] justify-end items-center h-full">
                    {hasEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita disparar o clique da linha
                          onEdit(item);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {
                          index % 2 === 0 ?
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.3113 4.87844L14.1216 0.689686C13.9823 0.550362 13.8169 0.439842 13.6349 0.364439C13.4529 0.289035 13.2578 0.250225 13.0608 0.250225C12.8638 0.250225 12.6687 0.289035 12.4867 0.364439C12.3047 0.439842 12.1393 0.550362 12 0.689686L0.439695 12.25C0.299801 12.3888 0.188889 12.554 0.113407 12.736C0.0379245 12.918 -0.000621974 13.1133 7.58901e-06 13.3103V17.5C7.58901e-06 17.8978 0.158043 18.2794 0.439347 18.5607C0.720652 18.842 1.10218 19 1.50001 19H17.25C17.4489 19 17.6397 18.921 17.7803 18.7803C17.921 18.6397 18 18.4489 18 18.25C18 18.0511 17.921 17.8603 17.7803 17.7197C17.6397 17.579 17.4489 17.5 17.25 17.5H7.81126L18.3113 7C18.4506 6.86071 18.5611 6.69533 18.6365 6.51332C18.7119 6.33131 18.7507 6.13623 18.7507 5.93922C18.7507 5.74221 18.7119 5.54712 18.6365 5.36511C18.5611 5.1831 18.4506 5.01773 18.3113 4.87844ZM9.75001 5.06031L11.3147 6.625L3.37501 14.5647L1.81032 13L9.75001 5.06031ZM1.50001 17.5V14.8103L4.18969 17.5H1.50001ZM6.00001 17.1897L4.43626 15.625L12.375 7.68531L13.9397 9.25L6.00001 17.1897ZM15 8.18969L10.8113 4L13.0613 1.75L17.25 5.93969L15 8.18969Z" fill="black" />
                            </svg>
                            :
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.3113 4.87844L14.1216 0.68969C13.9823 0.550366 13.8169 0.439846 13.6349 0.364442C13.4529 0.289039 13.2578 0.250229 13.0608 0.250229C12.8638 0.250229 12.6687 0.289039 12.4867 0.364442C12.3047 0.439846 12.1393 0.550366 12 0.68969L0.439695 12.25C0.299801 12.3888 0.188889 12.554 0.113407 12.736C0.0379245 12.918 -0.000621974 13.1133 7.58901e-06 13.3103V17.5C7.58901e-06 17.8978 0.158043 18.2794 0.439347 18.5607C0.720652 18.842 1.10218 19 1.50001 19H17.25C17.4489 19 17.6397 18.921 17.7803 18.7803C17.921 18.6397 18 18.4489 18 18.25C18 18.0511 17.921 17.8603 17.7803 17.7197C17.6397 17.579 17.4489 17.5 17.25 17.5H7.81126L18.3113 7C18.4506 6.86071 18.5611 6.69534 18.6365 6.51333C18.7119 6.33131 18.7507 6.13623 18.7507 5.93922C18.7507 5.74221 18.7119 5.54713 18.6365 5.36512C18.5611 5.18311 18.4506 5.01773 18.3113 4.87844ZM9.75001 5.06031L11.3147 6.625L3.37501 14.5647L1.81032 13L9.75001 5.06031ZM1.50001 17.5V14.8103L4.18969 17.5H1.50001ZM6.00001 17.1897L4.43626 15.625L12.375 7.68532L13.9397 9.25L6.00001 17.1897ZM15 8.18969L10.8113 4L13.0613 1.75L17.25 5.93969L15 8.18969Z" fill="#FAFAFA" />
                            </svg>
                        }
                      </button>
                    )}
                    {hasDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.25 3.5H13.5V2.75C13.5 2.15326 13.2629 1.58097 12.841 1.15901C12.419 0.737053 11.8467 0.5 11.25 0.5H6.75C6.15326 0.5 5.58097 0.737053 5.15901 1.15901C4.73705 1.58097 4.5 2.15326 4.5 2.75V3.5H0.75C0.551088 3.5 0.360322 3.57902 0.21967 3.71967C0.0790178 3.86032 0 4.05109 0 4.25C0 4.44891 0.0790178 4.63968 0.21967 4.78033C0.360322 4.92098 0.551088 5 0.75 5H1.5V18.5C1.5 18.8978 1.65804 19.2794 1.93934 19.5607C2.22064 19.842 2.60218 20 3 20H15C15.3978 20 15.7794 19.842 16.0607 19.5607C16.342 19.2794 16.5 18.8978 16.5 18.5V5H17.25C17.4489 5 17.6397 4.92098 17.7803 4.78033C17.921 4.63968 18 4.44891 18 4.25C18 4.05109 17.921 3.86032 17.7803 3.71967C17.6397 3.57902 17.4489 3.5 17.25 3.5ZM6 2.75C6 2.55109 6.07902 2.36032 6.21967 2.21967C6.36032 2.07902 6.55109 2 6.75 2H11.25C11.4489 2 11.6397 2.07902 11.7803 2.21967C11.921 2.36032 12 2.55109 12 2.75V3.5H6V2.75ZM15 18.5H3V5H15V18.5ZM7.5 8.75V14.75C7.5 14.9489 7.42098 15.1397 7.28033 15.2803C7.13968 15.421 6.94891 15.5 6.75 15.5C6.55109 15.5 6.36032 15.421 6.21967 15.2803C6.07902 15.1397 6 14.9489 6 14.75V8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8C6.94891 8 7.13968 8.07902 7.28033 8.21967C7.42098 8.36032 7.5 8.55109 7.5 8.75ZM12 8.75V14.75C12 14.9489 11.921 15.1397 11.7803 15.2803C11.6397 15.421 11.4489 15.5 11.25 15.5C11.0511 15.5 10.8603 15.421 10.7197 15.2803C10.579 15.1397 10.5 14.9489 10.5 14.75V8.75C10.5 8.55109 10.579 8.36032 10.7197 8.21967C10.8603 8.07902 11.0511 8 11.25 8C11.4489 8 11.6397 8.07902 11.7803 8.21967C11.921 8.36032 12 8.55109 12 8.75Z" fill="#F87171" />
                        </svg>
                      </button>
                    )}
                    {hasAddPresence && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddPresence(item);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                          <path fill="#43A047" d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"></path>
                        </svg>
                      </button>
                    )}
                    {hasReturnGame && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReturnGame(item);
                        }}
                        className="font-bold text-2xl mr-6"
                      >
                        DEVOLVER
                      </button>
                    )}
                    {hasGreenButton && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGreenButtonPress(item);
                        }}
                        className="bg-green-500 text-zinc-50 flex py-2 px-7 rounded-[20px]"
                      >
                        {greenButtonContent}
                      </button>
                    )}
                    {hasAddPlayer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddPlayer(item);
                        }}
                        className=""
                      >
                        <svg fill={index % 2 === 0 ? "#000000" : "#FAFAFA"} height="24" width="24" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 512 512" xml:space="preserve">
                          <g>
                            <g>
                              <polygon points="451.368,229.053 451.368,168.421 410.947,168.421 410.947,229.053 350.316,229.053 350.316,269.474 
			410.947,269.474 410.947,330.105 451.368,330.105 451.368,269.474 512,269.474 512,229.053 		"/>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M239.915,276.724c33.652-18.238,56.506-53.864,56.506-94.829c0-59.531-48.259-107.789-107.789-107.789
			S80.842,122.364,80.842,181.895c0,40.965,22.854,76.591,56.506,94.829C66.732,283.298,0,352.877,0,437.895h377.263
			C377.263,352.877,310.531,283.298,239.915,276.724z"/>
                            </g>
                          </g>
                        </svg>

                      </button>
                    )}
                    {customButton && (
                      customButton(item)
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}